export declare abstract class AbstractMapper<From, To> {
    abstract map(from: From): To;
    abstract reverseMap(from: To): From;
    mapFromList(from: From[]): To[];
    reverseMapFromList(from: To[]): From[];
}
