import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {TodoCreateRequest} from '../../requests/CreateTodoRequest';
import {createToDo} from "../../businessLogic/ToDo";
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    console.log("Processing Event ", event);
    logger.info('Creating a Todo');
    const auth = event.headers.Authorization;
    const spaced = auth.split(' ');
    const jwtToken = spaced[1];

    const newTodo: TodoCreateRequest = JSON.parse(event.body);
    const todo = await createToDo(newTodo, jwtToken);

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": todo
        }),
    }
};
