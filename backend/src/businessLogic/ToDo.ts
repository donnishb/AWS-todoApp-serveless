import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {TodoCreateRequest} from "../requests/CreateTodoRequest";
import {TodoUpdateRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoClass} from "../dataAccess/ToDoClass";

const uuidv4 = require('uuid/v4');
const todoObj = new ToDoClass();

export function createToDo(createTodoRequest: TodoCreateRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3Bucket = process.env.S3_BUCKET_NAME;
    
    return todoObj.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3Bucket}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return todoObj.getAllToDo(userId);
}

export function updateToDo(updateTodoRequest: TodoUpdateRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return todoObj.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return todoObj.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return todoObj.generateUploadUrl(todoId);
}