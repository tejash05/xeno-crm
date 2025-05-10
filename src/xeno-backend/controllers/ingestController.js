import Customer from '../models/Customer.js'
import Order from '../models/Order.js'

export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body)
    await customer.save()
    res.status(201).json({ message: 'Customer saved', customer })
  } catch (err) {
    res.status(500).json({ message: 'Error saving customer', error: err.message })
  }
}

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json({ message: 'Order saved', order })
  } catch (err) {
    res.status(500).json({ message: 'Error saving order', error: err.message })
  }
}
