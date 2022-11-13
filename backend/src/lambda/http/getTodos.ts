import 'source-map-support/register'
import {getAllToDo} from "../../businessLogic/ToDo";
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    console.log("Event: ", event);
    const authorization = event.headers.Authorization;
    const spaced = authorization.split(' ');
    const jwtToken = spaced[1];

    const Alltodo = await getAllToDo(jwtToken);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "items": Alltodo,
        }),
    }
};
