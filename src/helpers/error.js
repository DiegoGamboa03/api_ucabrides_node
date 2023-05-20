import createError from 'http-errors';

export const routeNotFound = async (req, res, next) => {
    next(createError.NotFound('This Route does not exist'))
}

export const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message, 
        }
    })
}

export const splitError = (err) => {
    return err.message.split(')');   
}