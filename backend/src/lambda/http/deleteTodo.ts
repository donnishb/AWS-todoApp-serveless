import 'source-map-support/register'
import {deleteToDo} from "../../businessLogic/ToDo";
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import { createLogger } from '../../utils/logger'
const logger = createLogger('del');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    console.log("Event: ", event);
    logger.info('Deletin todoItem');
    

    const auth = event.headers.Authorization;
    const space = auth.split(' ');
    const jwtToken = space[1];

    const id = event.pathParameters.todoId;

    const del = await deleteToDo(id, jwtToken);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: del,
    }
};
