export interface IUser {
 _id: string;
 name: string;
 email: string;
 image?: string;
 bio?: string;
 role:string;
 createdAt: Date;
 updatedAt: Date;
 }
 
 export interface IPost {
 _id: string;
 title: string;
 slug: string;
 content: string;
 excerpt?: string;
 coverImage?: string;
 author: IUser | string;
 published: boolean;
 createdAt: Date;
 updatedAt: Date;
 }