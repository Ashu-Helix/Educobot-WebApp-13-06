// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { unlinkSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as path from 'path';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id: string = req.body.id
  const dir = path.join(__dirname, '../..', 'scripts', id + '.py');
  const outputDir = path.join(__dirname, '../..', 'outputs', id + '.txt')

  unlinkSync(dir);
  unlinkSync(outputDir);

  res.status(200).json(dir)
}
