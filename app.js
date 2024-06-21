const express = require('express');
const ExpressError = require('./ExpressError');

const app = express();

app.get('/', (req, res, next) => {
    return res.send(`
        <h1>Express Calculator</h1>
        <ul>
            <li> /mean?nums=1,2,3 - to get the mean of nums</li>
            <li> /median?nums=1,2,3 - to get the median of nums</li>
            <li> /mode?nums=1,2,3 - to get the mode of nums</li>
        </ul>
        `)
})

app.use(express.json());

app.use('/mean', (req, res, next) => {
    if (req.query.nums) {
        const nums = req.query.nums.split(',').map(Number);
        const allNumbers = nums.every(Number.isFinite);
        
        if (allNumbers) {
            const sum = nums.reduce((acc, current) => acc + current, 0);
            const mean = sum / nums.length;
            return res.json({
                response: {
                    operation: "mean",
                    value: mean
                }
            });
        } else {
            return next(new ExpressError("All values must be numbers", 400));
        }
    } else {
        return next(new ExpressError("Numbers are required", 400));
    }
});

app.use('/median', (req, res, next) => {
    if (req.query.nums) {
        const nums = req.query.nums.split(',').map(Number);
        const allNumbers = nums.every(Number.isFinite);
        
        if (allNumbers) {
            const sorted = nums.slice().sort((a, b) => a - b);
            const middleId = Math.floor(sorted.length / 2);
            
            let median;
            
            if (sorted.length % 2 === 0) {
                median = sorted[middleId - 1];
            } else {
                median = sorted[middleId];
            }
            
            return res.json({
                response: {
                    operation: "median",
                    value: median
                }
            });
            
        } else {
            return next(new ExpressError("All values must be numbers", 400));
        }
    } else {
        return next(new ExpressError("Numbers are required", 400));
    }
});

app.use('/mode', (req, res, next) => {
    if (req.query.nums) {
        const nums = req.query.nums.split(',').map(Number);
        const allNumbers = nums.every(Number.isFinite);
        
        if (allNumbers) {
            const numCount = {};
            let max = 0;
            let mode = null;
            let multiples = false;
            
            nums.forEach(num => {
                numCount[num] = (numCount[num] || 0) + 1;
                if (numCount[num] > max) {
                    max = numCount[num];
                    mode = num;
                    multiples = false;
                } else if (numCount[num] === max) {
                    multiples = true;
                }
            });
            
            if (multiples || max === 1) {
                return res.json({
                    response: {
                        operation: "mode",
                        error: "no single mode"
                    }
                })
            }
            
            return res.json({
                response: {
                    operation: "mode",
                    value: mode
                }
            });
            
        } else {
            return next(new ExpressError("All values must be numbers", 400));
        }
    } else {
        return next(new ExpressError("Numbers are required", 400));
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({
        error: message
    });
});

module.exports = app;