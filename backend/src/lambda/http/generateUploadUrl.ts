import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic/ToDo";
import { createLogger } from '../../utils/logger';

const logger = createLogger('Upload URL');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log("Event: ", event);
    const todoId = event.pathParameters.todoId;

    const url = await generateUploadUrl(todoId);
    logger.info(`Generating uploadURL for todoItem: ${todoId}`);
    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            uploadUrl: url,
        })
    };
};