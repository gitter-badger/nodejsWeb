module.exports = {
    // 错误码定义
    // code:大类型错误,小类型错误,采用string，清晰明确
    // message:错误的具体描述
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    //rest 风格的接口都是以api开头的
    restify: pathPrefix => {
        pathPrefix = pathPrefix || '/api/';

        return async(ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}`);
                ctx.rest = data => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                };
                // 集中处理异常，调用者只需在错误的时候，抛出异常即可
                try {
                    await next();
                } catch (e) {
                    console.log('Process API error');
                    ctx.response.status = 400;// 400 error, 200 ok
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};