import * as DataLoader from 'dataloader';
import * as _ from 'underscore';
import { ProductCategories } from '../apiCollections';

export default function generateDataLoaderProductCategory() {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await ProductCategories.find({
      _id: { $in: ids }
    }).toArray();
    const resultById = _.indexBy(result, '_id');
    return ids.map(id => resultById[id]);
  });
}