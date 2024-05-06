export interface IPost {
    id: number;
    title: string;
    content: string;
    category: {
        id: number;
        name: string;
    },
    createdAt: Date;
    updatedAt: Date;
    photos: any[];
    author: {
        id: number;
        fullName: string;
        email: string;
    }
}