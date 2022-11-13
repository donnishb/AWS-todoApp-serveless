import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from '../utils/logger';
const logger = createLogger('TodosAccess');

const AWS_Xray = require('aws-xray-sdk')
const Xray_AWS = AWS_Xray.captureAWS(AWS)

export class ToDoClass {
    constructor(
        private readonly s3Bucket = process.env.S3_BUCKET_NAME,
        private readonly s3InstanceClient: Types = new Xray_AWS.S3({ signatureVersion: 'v4' }),
        private readonly dynamoInstanceClient: DocumentClient = new Xray_AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        ) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {

        console.log("Fetching todos");
         
        const paramsObj = {
            TableName: this.todosTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const promiseResult = await this.dynamoInstanceClient.query(paramsObj).promise();
        console.log(promiseResult);
        const items = promiseResult.Items;

        return items as TodoItem[];
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {

        console.log("Creating a new todoItem");
        logger.info(`creating todoItem with id: ${todoItem.todoId}`);
        
        const paramsObj = {
            TableName: this.todosTable,
            Item: todoItem,
        };

        const promiseResult = await this.dynamoInstanceClient.put(paramsObj).promise();
        console.log(promiseResult);

        return todoItem as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {

        console.log("Updating todo");

        const paramsObj = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const promiseResult = await this.dynamoInstanceClient.update(paramsObj).promise();
        console.log(promiseResult);
        const att = promiseResult.Attributes;

        return att as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        
        console.log("Deleting todo");

        const paramsObj = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const promiseResult = await this.dynamoInstanceClient.delete(paramsObj).promise();
        console.log(promiseResult);

        return "" as string;
    }

    async generateUploadUrl(todoId: string): Promise<string> {

        console.log("Retrieving URL");
        logger.info('Generating upload URL', todoId);
        const url:string = this.s3InstanceClient.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: todoId,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }
}
