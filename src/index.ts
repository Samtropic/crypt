import { postLabel } from './Labels';
import { getMovements } from './Movements';
import { config, generateConfig } from './config';
import { IMovementResponseData } from './types/cryptio';

export const startScript = async () => {
  try {
    generateConfig();
  } catch (e: unknown) {
    if (e instanceof Error) console.error(e.message);
    return;
  }

  const movements = await getMovements({
    transaction_hashes: [config.TRANSACTION_HASH],
  });

  if (typeof movements !== 'string') {
    const inMvts = inMovementsFilter(movements);
    const assets = listAssetsInTransaction(inMvts);

    const { allIgnoreMvts, allRevenueMvts } = await verifyCounterpart(
      assets,
      config.TRANSACTION_HASH,
    );

    postLabel(
      {
        id: config.IGNORE_TAG_ID,
      },
      {
        movements: allIgnoreMvts,
      },
    );

    postLabel(
      {
        id: config.REVENUE_TAG_ID,
      },
      {
        movements: allRevenueMvts,
      },
    );
  }
};

export const inMovementsFilter = (
  movements: IMovementResponseData[],
): IMovementResponseData[] => {
  const filteredMovements = movements.filter((item) => item.direction === 'in');
  return filteredMovements;
};

export const getMovementsByAsset = async (
  asset: string,
  transaction_hash: string,
) => {
  const movements = await getMovements({
    transaction_hashes: [transaction_hash],
    assets: [asset],
  });
  return movements;
};

export const listAssetsInTransaction = (
  movements: IMovementResponseData[],
): string[] => {
  let foundAssets: string[] = [];
  movements.forEach((element) => {
    if (!foundAssets.includes(element.asset)) {
      foundAssets.push(element.asset);
    }
  });
  return foundAssets;
};

export const verifyCounterpart = async (
  assets: string[],
  transaction_hash: string,
) => {
  const results = await Promise.all(
    assets.map(async (asset) => {
      const thisAssetMvtIds = new Set();
      const assetTransactionMvts = await getMovementsByAsset(
        asset,
        transaction_hash,
      );

      let inValue = 0;
      let outValue = 0;

      if (typeof assetTransactionMvts !== 'string') {
        assetTransactionMvts.forEach((mvt) => {
          if (mvt.direction === 'in') {
            inValue += parseFloat(mvt.volume);
          }
          if (mvt.direction === 'out') {
            outValue += parseFloat(mvt.volume);
          }
          thisAssetMvtIds.add(mvt.id);
        });
      }

      const ignoreMvts =
        inValue === outValue ? Array.from(thisAssetMvtIds) : [];
      const revenueMvts =
        inValue !== outValue ? Array.from(thisAssetMvtIds) : [];

      return { asset, ignoreMvts, revenueMvts };
    }),
  );
  const allIgnoreMvts = results.flatMap(
    (result) => result.ignoreMvts,
  ) as string[];
  const allRevenueMvts = results.flatMap(
    (result) => result.revenueMvts,
  ) as string[];
  return { allIgnoreMvts, allRevenueMvts };
};

startScript();
