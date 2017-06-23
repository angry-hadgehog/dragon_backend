function parseField(field) {
    return field
        .split(/\[|\]/)
        .filter(s => s);
}

function getField(req, field) {
    let val = req.body;
    field.forEach((prop) => {
        val = val[prop];
    });
    return val;
}

exports.required = (field) => {
    field = parseField(field);
    return (req, res, next) => {
        if (getField(req, field)) {
            next();
        } else {
            res.redirect('back');
            res.send(`${field.join(' ')} is required`);
        }
    }
};

exports.lengthAbove = (field, len) => {
    field = parseField(field);
    return (req, res, next) => {
        if (getField(req, field).length > len) {
            next();
        } else {
            const fields = field.join(' ');
            res.redirect('back');
            res.send(`${fields} must have more than ${len} characters`);
        }
    }
};