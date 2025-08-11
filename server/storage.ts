import { 
  users, 
  editals, 
  verticalizedContents,
  type User, 
  type InsertUser,
  type Edital,
  type InsertEdital,
  type VerticalizedContent,
  type InsertVerticalizedContent
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Edital methods
  createEdital(edital: InsertEdital): Promise<Edital>;
  getEdital(id: number): Promise<Edital | undefined>;
  
  // VerticalizedContent methods
  createVerticalizedContent(content: InsertVerticalizedContent): Promise<VerticalizedContent>;
  getVerticalizedContentByEditalId(editalId: number): Promise<VerticalizedContent | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createEdital(insertEdital: InsertEdital): Promise<Edital> {
    const [edital] = await db
      .insert(editals)
      .values(insertEdital)
      .returning();
    return edital;
  }

  async getEdital(id: number): Promise<Edital | undefined> {
    const [edital] = await db.select().from(editals).where(eq(editals.id, id));
    return edital || undefined;
  }

  async createVerticalizedContent(insertContent: InsertVerticalizedContent): Promise<VerticalizedContent> {
    const [content] = await db
      .insert(verticalizedContents)
      .values(insertContent)
      .returning();
    return content;
  }

  async getVerticalizedContentByEditalId(editalId: number): Promise<VerticalizedContent | undefined> {
    const [content] = await db.select().from(verticalizedContents).where(eq(verticalizedContents.editalId, editalId));
    return content || undefined;
  }
}

export const storage = new DatabaseStorage();
