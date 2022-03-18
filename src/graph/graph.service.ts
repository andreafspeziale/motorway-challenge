import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Repository, EntitySubscriberInterface, Connection } from 'typeorm';
import { UndirectedGraph } from 'graphology';
import { dijkstra } from 'graphology-shortest-path';
import { LoggerService } from '../logger/logger.service';
import { Node } from '../nodes/entities';
import { Edge } from '../edges/entities';
import { ShortestPathPayload } from './graph.interfaces';

@Injectable()
export class GraphService implements OnModuleInit, EntitySubscriberInterface<Edge> {
  private graph: UndirectedGraph;

  constructor(
    private readonly logger: LoggerService,
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
    @InjectRepository(Edge)
    private readonly edgeRepository: Repository<Edge>
  ) {
    this.logger.setContext(GraphService.name);
    this.connection.subscribers.push(this);
  }

  private async initGraph(): Promise<void> {
    this.logger.debug('Initializing graph...', {
      fn: this.initGraph.name,
    });

    const nodes = await this.nodeRepository.find();
    const edges = await this.edgeRepository.find();

    this.graph = new UndirectedGraph();

    nodes.forEach((node) => this.graph.addNode(node.id, { name: node.name }));
    edges.forEach((edge) => this.graph.addEdge(edge.from, edge.to, { weight: edge.weight }));

    this.logger.debug('Graph initialized', {
      fn: this.initGraph.name,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.initGraph();
  }

  async afterInsert(): Promise<void> {
    await this.initGraph();
  }

  computeShortestPath(data: ShortestPathPayload): string[] {
    this.logger.debug('Computing shortest path...', {
      fn: this.computeShortestPath.name,
      data,
    });

    const shortestPath = dijkstra.bidirectional(this.graph, data.from, data.to);

    this.logger.debug('Shortest path', {
      fn: this.computeShortestPath.name,
      data,
    });

    return shortestPath;
  }

  computePathWeight(path: string[]): number {
    this.logger.debug('Computing path weight...', {
      fn: this.computePathWeight.name,
      path,
    });

    const pathWeight = path.reduce((acc, node, index) => {
      const next = path[index + 1];
      if (next) {
        const edge = this.graph.edge(node, next);
        const weight = this.graph.getEdgeAttribute(edge, 'weight');
        acc += weight;
      }

      return acc;
    }, 0);

    this.logger.debug('Path weight...', {
      fn: this.computePathWeight.name,
      pathWeight,
    });

    return pathWeight;
  }
}
