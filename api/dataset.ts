import { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from "fs";
import { parse } from "csv-parse";


module.exports = async (req: VercelRequest, res: VercelResponse) => {
    let result : number[][] = [];
    fs.createReadStream("static/train_x.csv")
        .pipe(parse({ delimiter: ",", from_line: 1 }))
        .on("data", (row: string[]) => {
            result.push(row.map(element => parseFloat(element)).slice());
        })
        .on("end", () => {
            res.status(200).json(result);
        })
        .on("error", (error) => {
            console.log(error);
        })
}