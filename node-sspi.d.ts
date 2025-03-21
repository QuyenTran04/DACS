declare module "node-sspi" {
    
  class NodeSSPI {
    constructor(options?: any);
    authenticate: (req: any, res: any, next: any) => void;
  }
  export = NodeSSPI;
}
