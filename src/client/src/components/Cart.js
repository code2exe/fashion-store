import React from 'react';
import Header from './Header'
import { Route, Redirect } from 'react-router'
import { withRouter } from "react-router-dom";

import { connect } from 'react-redux'
import _ from 'lodash'
import { Media, Row, Col, Button, Image, Modal, OverlayTrigger } from 'react-bootstrap';
import Popup from "reactjs-popup";
import Iframe from 'react-iframe'
import { fetchBanks, bankSelected, sendPayment, bankLoginCompleted } from '../actions/store.actions'

import Checkout from './Checkout'
import Spinner from 'react-spinkit'

// TODO dispatch is so they can remove items from the cart.  Low priority
// TODO prob need row/col instead of media component so things line up better
const ItemRow = ( { item, dispatch } ) => (

    <Row style={{ marginTop: 10 }}>
        <Col xs={1} md={1}/>
        <Col xs={2} md={2}>
            <Image style={{ height: 50 }} src={item.url}/>
        </Col>
        <Col xs={2} md={2}>
            {item.title}
        </Col>
        <Col xs={3} md={3}>
            {item.qty}
        </Col>
        <Col xs={3} md={3}>
            ${item.price}
        </Col>
        <Col xs={1} md={1}/>
    </Row>
)

const BankLogin = ( { show, paymentMethodLoginUrl, paymentLoginInitiated, onHide } ) => (
    <Modal show={show}>
        <Modal.Body>

            <div style={{ width: 450, height: 600 }}>

                {paymentLoginInitiated ?
                    <div style={{ left: '57%', top: '50%', position: 'relative' }}>
                        <Spinner name='double-bounce'/>
                    </div> :
                    <div style={{ position: 'absolute', left: 70, }}>
                        <Iframe url={paymentMethodLoginUrl}

                                width="450px"
                                height="550px"
                        />
                    </div>
                }


                <Button onClick={onHide}
                        style={{ position: 'absolute', left: 250, bottom: 10 }}>Cancel</Button>
            </div>
        </Modal.Body>
    </Modal>
)

class Cart extends React.Component
{
    constructor( props )
    {
        super( props )

        this.state = { showCheckout: false }
    }

    componentWillReceiveProps( nextProps )
    {
        if ( nextProps.bankLoginCompleted )
        {
            this.props.history.push( "/paymentcomplete" );
        }
    }

    render()
    {
        let { cartItems, dispatch, total, paymentMethodLoginUrl, paymentLoginInitiated } = { ...this.props }


        return (
            <div>
                <Header/>
                <div style={{ margin: 50 }}>
                    <div style={{ margin: 20 }}>
                        SHOPPING CART
                    </div>

                    <div style={{ marginLeft: 50, marginRight: 50 }}>
                        <Row>
                            <Col xs={1} md={1}/>
                            <Col xs={3} md={3}>
                                ITEM
                            </Col>
                            <Col xs={1} md={1}/>
                            <Col xs={3} md={3}>
                                QTY.
                            </Col>
                            <Col xs={1} md={1}/>
                            <Col xs={1} md={1}>
                                PRICE
                            </Col>
                            <Col xs={1} md={1}/>
                            <Col xs={1} md={1}/>
                        </Row>

                        <hr/>

                        {cartItems.map( ( item, i ) => <ItemRow key={i} item={item} dispatch={dispatch}/> )}

                    </div>

                    <Row>
                        <Col xs={6} md={6}/>
                        <Col xs={3} md={3}>
                            SUBTOTAL ${total}
                        </Col>
                        <Col xs={3} md={3}/>
                    </Row>
                    <hr/>

                    <Button onClick={() =>
                    {
                        dispatch( fetchBanks() )
                        this.setState( { showCheckout: true } )
                    }}
                            disabled={!total || total <= 0}
                    >CHECKOUT</Button>


                    <Checkout
                        onHide={() =>
                        {
                            this.setState( { showCheckout: false } )
                        }}
                        show={this.state.showCheckout}
                    />

                    <BankLogin show={paymentLoginInitiated || !!paymentMethodLoginUrl}
                               paymentLoginInitiated={paymentLoginInitiated}
                               paymentMethodLoginUrl={paymentMethodLoginUrl}
                               onHide={() => dispatch( bankLoginCompleted( null ) )}
                    />
                </div>
            </div>
        )
    }
}


export default connect( state =>
{
    return {
        cartItems: state.store.cartItems,
        banks: state.store.banks,
        total: state.store.total,
        paymentMethodLoginUrl: state.store.paymentMethodLoginUrl,
        paymentLoginInitiated: state.store.paymentLoginInitiated,
        bankLoginCompleted: state.store.bankLoginCompleted,
    }
} )( Cart )
