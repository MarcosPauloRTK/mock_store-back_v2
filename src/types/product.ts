export type ProductDB = {
    id: number,
    title: string,
    category_id: number,
    description: string,
    price: number,
    rate: number,
    image: string,
    count: number
}
export type Product= {
    id: number,
    title: string,
    category: string,
    description: string,
    price: number,
    rating: {rate: number,
    count: number},
    image: string
}


