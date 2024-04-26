const PORT = 9001; // Указание порта, на котором будет работать сервер

const URLDB = 'mongodb://127.0.0.1:27017';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('./config');
const User = require('./models/User');
const app = express();
const Product = require ('./models/Product')
const Report = require ('./models/Report')

app.use(cors());
app.use(express.json());

const generateAccessToken = (id, login, password, email) => {
    const payload = {
        id, login, password, email
    };
    return jsonwebtoken.sign(payload, secret, { expiresIn: '24h' });

}

app.post('/registration', async (req, res) => {
    console.log(req.body);
    const { login, password, email} = req.body;
    const user = new User({ login, password, email});
    await user.save();
    res.json({
        message: 'Вы успешно зарегистрировались !!!'
    })
});

app.post('/login', async (req, res) => {
    console.log(req.body)
    const { login, password } = req.body
    const user = await User.findOne({login})
    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
       
    }
    if (user.password !==password  ) {
        return res.status(400).json({ message: 'Неверный логин или пароль' })
        
    }
     else {
        const token = generateAccessToken (user._id,user.login,user.password,user.email)
        return res.json({
            message: 'Вы успешно авторизованы !!!',
            token: token
        })
    }
})

  
app.get('/products', async (req, res) => {
   
       const products = await Product.find()//вывести все с базы данных значение Product
     res.json({
         data: products
     })
 })



//////////////////////////////////////////////////////////////
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
  });

/////////////////////////////

const start = async () => {
    try {
        await mongoose.connect(URLDB, { authSource: "admin" });
        app.listen(PORT, () => console.log('Сервер запущен на ${PORT} порте'));
    } catch (e) {
        console.log(e);
    }
}
///////////////////////////////////
app.get('/reports', async (req, res) => {
   
    const reports = await Report.find()
  res.json({
      data: reports
  })
})
////////////////////////////////////
app.post('/reports/add', async (req, res) => {
    console.log(req.body);
    const { r,i,s,y} = req.body
    const report = new Report({r,i,y,s})
    await report.save();
    res.json({
        message: 'Вы сохранили отчет !!!'
    })
});  
///////////////////////////////////////
app.post('/products/add', async (req, res) => {
    console.log(req.body)
    const { ratio,  condition, nameInfo, nameCalc} = req.body
    const product = new Product({ratio,  condition, nameInfo, nameCalc})

    try {
        await product.save()
        
    } catch (err) {
        if (err && err.code !== 11000) {
            res.json({
                message: 'Неизвестная ошибка!'
            })
                .status(500)

            return
        }
    }

    res.json({
        message: 'ВЫ ЗАПУСТИЛИ ПРОДУКТ! Обновите страницу для получения изменений.'
    })
})
////////////////////////////////////////
app.post('/products', async (req, res) => {
    console.log(req.body)
    const { ratio,  condition, nameInfo, nameCalc} = req.body
    const product = new Product({ratio,  condition, nameInfo, nameCalc})

    try {
        await product.save()
        
    } catch (err) {
        if (err && err.code !== 11000) {
            res.json({
                message: 'Неизвестная ошибка!'
            })
                .status(500)

            return
        }
    }

    res.json({
        message: 'ВЫ ЗАПУСТИЛИ ПРОДУКТ! Обновите страницу для получения изменений.'
    })
})
///////////////////////////////////////////
app.post('/user/newPassword', async (req, res) => {
    console.log(req.body)
    const { token, password } = req.body
    let user

    try {
        user = await User.findOneAndUpdate( { login: jsonwebtoken.verify(token, secret).login },
            {password : password   }, { returnOriginal: false })

        if (user === null) {
            res.json({
                message: 'Пользователь отсутствует в базе.'
            })
                .status(400)
        }
    } catch (err) {
        res.json({
            message: 'Неизвестная ошибка.'
        })
            .status(500)

        return
    }

    res.json({
        message: 'Пароль изменён! выйдите и зайдите под новым паролем'
       
    })
})
/////////////////////////////
app.put('/products/:id', async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
/////////////////////////////////////
/////////////////////////////
app.post('/user/newStatus', async (req, res) => {
    console.log(req.body)
    const { token, login } = req.body
    let user

    try {
        user = await User.findOneAndUpdate( { login: jsonwebtoken.verify(token, secret).login },
            {status : login  }, { returnOriginal: false })

        if (user === null) {
            res.json({
                message: 'Пользователь отсутствует в базе.'
            })
                .status(400)
        }
    } catch (err) {
        res.json({
            message: 'Неизвестная ошибка.'
        })
            .status(500)

        return
    }

    res.json({
        message: 'Status изменён! выйдите и зайдите под новым статусом'
       
    })
})
/////////////////////////////////////
start(); 
