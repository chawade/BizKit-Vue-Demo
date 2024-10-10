interface PriceListDDL {
    name: string;
    value: string;
}
export default class PriceList {
    private model: PriceListDDL[];

    constructor() {
        this.model = [];
    }

    getPriceList = (): PriceListDDL[] => {
        for (let index = 1; index <= 10; index++) {
            // Populate the model with some dummy data for example purposes
            this.model.push({
                name: `Price ${index}`,
                value: `${index}`
            });
        }
        return this.model;
    }
}
