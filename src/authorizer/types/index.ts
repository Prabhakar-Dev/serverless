export interface CustomAPIGatewayProxyEvent {
    readonly authorizationToken: string;
    readonly methodArn: string
    readonly requestId: string
}
