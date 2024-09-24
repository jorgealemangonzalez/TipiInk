import {stripe} from '../api/Stripe'
import {Product} from '../functions/connect/imported/interfaces'


(async () => {
    const stripeAccount = 'acct_1Pl6ISEOHjcLgC9k'
    const subscriptions = await stripe.subscriptions.retrieve('sub_1PlXs8EOHjcLgC9kOrqdquUs', {
        expand: ['default_payment_method', 'items.data.price.product'],
    }, {
        stripeAccount,
    })

    const p = subscriptions.items.data[0].price.product as unknown as Product
    const product = await stripe.products.retrieve(p.id, {
        stripeAccount,
    })

    console.log(product)
})()
