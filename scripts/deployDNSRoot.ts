import { toNano } from '@ton/core';
import { DNSRoot } from '../build/DNSRoot/DNSRoot_DNSRoot';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const DNSRootContract = provider.open(await DNSRoot.fromInit());

    await DNSRootContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(DNSRootContract.address);

    // run methods on `cryptoStateDNS`
}
