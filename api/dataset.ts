import { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

const readFile : (file : string) => Promise<string[][]> = (file : string) => {
    return new Promise((resolve, reject) => {
        const rows : string[][] = [];
        fs.createReadStream(path.resolve("./static", file))
            .pipe(parse({ delimiter: ",", from_line: 1 }))
            .on("data", (row : string[]) => {
                rows.push(row);
            })
            .on("end", () => {
                resolve(rows);
            })
            .on("error", (error) => {
                console.log(error);
            });
    })
}

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    const promises : Promise<string[][]>[] = [];
    fs.readdir(path.resolve('./static'), (error, files) => {
        for (let i = 0; i < files.length; i++) {
            promises.push(readFile(files[i]));
        }
        Promise.all(promises).then((data) => {
            const trainingSet = data[0].map(row => row.map(element => parseFloat(element)));
            const labelSet = data[1].map(row => parseInt(row[0]));
            res.status(200).json({
                trainingSet,
                labelSet
            });
        }).catch(error => {
            console.log(error);
        })
    })
}