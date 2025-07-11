import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SBTItem } from '../build/SBTItem/SBTItem_SBTItem';
import '@ton/test-utils';

describe('SBTItem', () => {
    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let sBTItem: SandboxContract<SBTItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        owner = await blockchain.treasury('owner');

        sBTItem = blockchain.openContract(await SBTItem.fromInit(0n, owner.address, null, null, null, 0n));


        const deployResult = await sBTItem.send(
            owner.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: sBTItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sBTItem are ready to use
    });
});
