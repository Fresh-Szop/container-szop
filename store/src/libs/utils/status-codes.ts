/**
 * Codes that indicate successful processing of request.
 */
const success = {
	/** 
	 * Standard response for success.
	 * 
	 * Should provide body with requested entity or result of action
	 */
	ok: 200,
	/**
	 * Response indicating successful creation of resource.
	 * 
	 * Should provide body or [Location] header, with id or url to created resource.
	 * Non-standard usage may provide created entity in body and reference uri in header.
	 */
	created: 201,
	/**
	 * Response indicating acceptance of request for processing in later time.
	 * 
	 * Response might contain current status of job (like position in queue),
	 * reference/uri to status monitoring of job, or [Retry-After] header.
	 */
	accepted: 202,
	/**
	 * Response indicating that request was fulfilled and no content is returned.
	 * 
	 * Response does not contain body, but could contain informative headers.
	 * 
	 * Usually used when endpoint accepts changes from user, that edits resource
	 * in optimistic way or keeps full state.
	 */
	noContent: 204,
} as const

const redirect = {
	moved: 301,
	found: 302,
	seeOther: 303,
	temporary: 307,
	permanent: 308,
} as const

/**
 * Client error codes, which indicate problem with request.
 * 
 * Responses should contain explanation to why request was rejected.
 */
const error = {
	/**
	 * Response indicating inability to process received request.
	 * 
	 * Usually send when required information was not provided in request
	 * (like body, form, query params, url params, cookies, headers).
	 */
	badRequest: 400,
	/**
	 * Response indicating that request does not contain credentials, while uri
	 * requires them to be present.
	 * 
	 * Usually send when user presents when anonymous user tries to access
	 * not-public resource.
	 */
	unauthorized: 401,
	/** 
	 * Response indicating that current **authenticated** user does not have 
	 * permissions to access this resource.
	 * 
	 * Response might either be due to user not being able to access resources of
	 * other user that was not shared to them, or them having insufficient role.
	 */
	forbidden: 403,
	/**
	 * Response indicating that requested resource cannot be currently found.
	 * 
	 * Response does not have any implications as to whether resource will be 
	 * available in the future, or not.
	 */
	notFound: 404,
	/**
	 * Response indicating conflict in requested resources and state of the server.
	 * 
	 * This response might for example apply to request for given amount of resource
	 * (like when client of e-commerce tries to buy some amount of product, that
	 * was already bought by someone else before shopping cart was updated).
	 */
	conflict: 409,
	/**
	 * Response of similar information to {@link sc.error.notFound | not found},
	 * but indicating permanent absence of requested resource.
	 * 
	 * The response should be used when resource is forever gone and every single
	 * request to resource will also fail in the future - for example when requesting
	 * uuid token.
	 */
	gone: 410,
	/**
	 * Response indicating that provided content is of valid type/format, but is
	 * semantically invalid.
	 * 
	 * This can be for example used for valid jwt, that is wrong type.
	 */
	unprocessableContent: 422,
} as const

/**
 * Server error codes, which indicate error while processing request / creating response.
 * 
 * Responses can contain explanation to what happened.
 */
const exception = {
	/**
	 * Response indicating generic exception while processing request / creating response.
	 */
	internalServerError: 500,
	/**
	 * Response indicating that request is valid, but functionality that it implies has
	 * not been implemented yet.
	 */
	notImplemented: 501,
	/**
	 * Response indicating that server is acting as gateway/proxy and received invalid
	 * response from upstream.
	 */
	badGateway: 502,
} as const

/**
 * HTTP response codes.
 */
const sc = {
	success,
	redirect,
	error,
	exception,
} as const

export default sc
