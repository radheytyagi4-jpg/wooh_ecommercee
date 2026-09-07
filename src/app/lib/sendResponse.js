export function sendResponse(response) {
    return Response.json(
        {
            success: response.success,
            message: response.message,
            data: response.data ?? null,
            errors: response.errors ?? undefined
        },
        { status: response.statusCode }
    );
}