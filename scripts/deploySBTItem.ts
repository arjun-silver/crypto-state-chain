import { toNano } from '@ton/core';
import { SBTItem } from '../build/SBTItem/SBTItem_SBTItem';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sBTItem = provider.open(await SBTItem.fromInit());

    await sBTItem.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(sBTItem.address);

    // run methods on `sBTItem`
}
