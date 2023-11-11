import fs from 'fs';
import Entry from '@/data/interfaces/entry';
import { MATCH_ALL_ENTRIES } from '@/data/interfaces/queryFilter';
import { getSections } from '@config/siteConfig';

type RouteDictionary = {
  [key: string]: Entry;
};

export async function generateRouteDictionary(): Promise<RouteDictionary> {
  console.log('scanning for content');
  const promises: Promise<Entry[]>[] = [];
  for (const section of getSections()) {
    promises.push(section.provider2.getAllEntries());
  }
  const routeMap: RouteDictionary = {};
  await Promise.all(promises)
    .then((all) => {
      console.log(`scanned ${all.length} sections`);
      all.forEach((entries) =>
        entries.forEach((entry) => (routeMap[entry.route] = entry)),
      );
    })
    .catch((error) => console.log(error));
  console.log('finished scanning for content');
  console.log(`found ${routeMap.length} routes`);
  const json = JSON.stringify(routeMap);
  fs.writeFileSync('./public/routes.json', json);
  return routeMap;
}
