class Work {
    constructor(name, description, address) {
        this.name = name;
        this.description = description;
        this.address = address;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address) {
        this.address = address;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }
}