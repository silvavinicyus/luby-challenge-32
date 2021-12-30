import  express, { Request, Response } from "express";
import cors from 'cors';

interface Car {
  id: number;
  marca: string;
  ano: string;
  cor: string;
  placa: string;
  imagem: string;
}

const app = express();

app.use(express.json());

app.use(cors());

var cars : Car[] = [];

let counter = 0;

function increment(): number {
  return ++counter;
}

const car: Car = {
  id: 0,
  marca: "Toyota Corolla",
  ano: "2020",
  cor: "Preto",
  placa: "ABC-8U76",
  imagem: "https://s2.glbimg.com/ZThVwCkB3BxGUU8hhHXYd2wuPS4=/0x0:920x628/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2020/a/i/5DgrA2SvydShlJYTAW1g/2019-09-03-corolla1.jpg"
}

cars.push(car);

app.get("/cars", (request: Request, response: Response) => {
  return response.json(cars);
});

app.delete("/cars/:id", (request: Request, response: Response) => {
  const { id } = request.params;

  const carIndex = cars.findIndex(car => car.id === Number(id));
  
  console.log(carIndex);

  cars.splice(carIndex, 1);

  return response.status(200).send();
});

app.post("/cars", (request: Request, response: Response) => {
  const { marca, ano, cor, placa, imagem } = request.body;

  const car: Car = { 
    id: increment(),
    marca, 
    ano, 
    cor, 
    placa, 
    imagem
  };  

  cars.push(car);
  
  return response.status(200).send();
});

app.listen(3333, () => {
  console.log("Server started at port 3333.");
});