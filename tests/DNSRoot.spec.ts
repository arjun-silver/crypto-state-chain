import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { DNSRoot } from '../build/DNSRoot/DNSRoot_DNSRoot';
import { DNSRecord } from '../build/DNSRoot/DNSRoot_DNSRecord';
import '@ton/test-utils';

describe('CryptoStateDNS', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let minter: SandboxContract<TreasuryContract>;
    let DNS: SandboxContract<DNSRoot>;
    let test: SandboxContract<DNSRecord>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        DNS = blockchain.openContract(await DNSRoot.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await DNS.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );
    
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: DNS.address,
            deploy: true,
            success: true,
        });
    });

    it('should resolve', async () => {
        // Let's mint test.cs
        test = blockchain.openContract(await DNSRecord.fromInit({ "$$type": "InitDNSRecord", domain: "test.cs" }));
        minter = await blockchain.treasury('minter');

        await test.send(minter.getSender(), { value: toNano('0.05') }, null);

        // Let's set a DNS record
        await test.send(minter.getSender(), { value: toNano('0.05') }, { $$type: "SetDNSRecord", address: minter.address });

        // Let's check!
        const resolver_address = await DNS.getResolve("test.cs");
        const resolved_resolver = await blockchain.openContract(DNSRecord.fromAddress(resolver_address));
        const resolved_address = await resolved_resolver.getResolve();
        
        expect(resolved_address?.equals(minter.address));
    });
});
