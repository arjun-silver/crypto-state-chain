import "./messages";
import "./constants";

// root DNS resolver
contract DNSRoot() {
    receive() {
        cashback(sender());
    }

    // by domain returns address of resolver
    get fun resolve(domain: String): Address {
        let resolver = initOf DNSRecord(InitDNSRecord { domain });
        return contractAddress(resolver);
    }
}


contract DNSRecord {
    // domain name that ends with .cs (crypto state)
    domain: String;
    address: Address?;
    owner: Address;
    
    receive() {
        cashback(sender());
    }
    
    init(data: InitDNSRecord) {
        self.domain = data.domain;
        self.address = null;
        self.owner = sender();
        cashback(sender());
    }

    receive(msg: SetDNSRecord) {
        // only owner can set DNS record
        throwIf(IncorrectSender, sender() != self.owner);
        self.address = msg.address;
        cashback(sender());
    }

    get fun resolve(): Address? {
        return self.address;
    }
}