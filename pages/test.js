
import Router from 'next/router'
import { useEffect } from 'react'
import { db } from '../firebase'

export default function order({ user, Allorders }) {

    console.log("user info", user)
    useEffect(() => {
        if (!user) {
            Router.push("/order")
        }
    }, [])

    return (
        <div className="col-md-12 col-lg-10" style={{ marginLeft: 100, padding: 50 }} >
            <div className="odr-box">
                <div className="title-left">
                    <h3>Your Order </h3>
                </div>
                <div className="rounded p-2 bg-light">
                    {/* {Allorders.user === user.uid &&( */}
                    <>
                        {/* console.log(`${user.uid} and ${Allorders.user} are same`) */}
                        {Allorders.map(order => {
                            return (
                                <>
                                    <div key={order.id} style={{ display: "flex", fontSize: "18px" }}>
                                        <span>{order.user}</span>

                                        <u> <h3>{order.order_user}</h3></u>
                                        <h5 style={{ marginLeft: "50px" }}>Your Order Date : {order.createdAt}</h5>

                                    </div>
                                    {order.order_product.map(product => {

                                        return (
                                            <div className="media mb-2 border-bottom" key={product.createdAt}>
                                                <div className="media-body"> <a href="#"> {product.productName}</a>
                                                    <div className="small text-muted">
                                                        price: {product.productCurrency}{product.productSellingPrice}
                                                        <span className="mx-2">|</span>
                                                        Qty: {product.quantity}
                                                        <span className="mx-2">|</span>
                                                        Subtotal: {product.productCurrency}{product.quantity * product.productSellingPrice}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div style={{ fontSize: "18px" }}>
                                        <h3>Total Amount : <b>{order.order_amount}</b></h3>
                                    </div>
                                </>
                            )
                        })}
                    </>
                    {/* )}{Allorders.user !== user.uid &&(
                    <p>No History</p>
                )} */}

                </div>
            </div>
        </div>


    )
}

export async function getServerSideProps(context) {

    const querySnap = await db.collection('orders').orderBy('createdAt', "desc")
        .get()

    const Allorders = querySnap.docs.map(docSnap => {
        return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toMillis(),
            id: docSnap.id
        }
    })
    return {
        props: { Allorders },
    }
}