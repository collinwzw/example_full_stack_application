package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

public class Handler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Gson gson = new Gson();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        context.getLogger().log("Received event: " + gson.toJson(input));

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.put("Access-Control-Allow-Headers", "Content-Type,Authorization");
        headers.put("Access-Control-Allow-Methods", "OPTIONS,GET");

        Map<String, String> body = new HashMap<>();
        body.put("message", "Hello World!");

        return new APIGatewayProxyResponseEvent()
                .withStatusCode(200)
                .withHeaders(headers)
                .withBody(gson.toJson(body));
    }
} 