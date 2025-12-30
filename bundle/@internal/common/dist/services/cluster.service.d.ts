import { ENVIRONMENTS } from '../config';
export declare class ClusterService {
    private static readonly logger;
    static clusterize(callback: () => void, ...onlyOnEnv: ENVIRONMENTS[]): void;
}
