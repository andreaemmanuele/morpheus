import React from 'react'
import { FC, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const Button: FC<{ href: string; children: ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      display: 'inline-block',
      margin: '20px 0',
    }}
  >
    {children}
  </a>
)

const ProductItem: FC<{ name: string; price: number; imageUrl: string }> = ({
  name,
  price,
  imageUrl,
}) => (
  <div
    style={{
      display: 'flex',
      marginBottom: '20px',
      padding: '10px',
      border: '1px solid #eee',
      borderRadius: '4px',
    }}
  >
    <img
      src={imageUrl}
      alt={name}
      style={{
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        marginRight: '15px',
      }}
    />
    <div>
      <h3 style={{ margin: '0 0 5px 0' }}>{name}</h3>
      <p style={{ margin: '0', color: '#555' }}>${price.toFixed(2)}</p>
    </div>
  </div>
)

const OrderConfirmationEmail: FC<{
  customerName: string
  orderNumber: string
  orderDate: string
  items: { name: string; price: number; imageUrl: string }[]
  total: number
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  estimatedDelivery: string
  trackingUrl: string
  companyInfo: {
    name: string
    address: string
    privacyUrl: string
    termsUrl: string
  }
}> = ({
  customerName,
  orderNumber,
  orderDate,
  items,
  total,
  shippingAddress,
  estimatedDelivery,
  trackingUrl,
  companyInfo,
}) => {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #2c3e50;
              padding: 20px;
              text-align: center;
            }
            .logo {
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 30px;
              background-color: #ffffff;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
              background-color: #f7f7f7;
            }
            .order-summary {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 4px;
            }
            .total {
              font-weight: bold;
              font-size: 18px;
              text-align: right;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px solid #eee;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">{companyInfo.name}</div>
          </div>

          <div className="content">
            <h1>Thank you for your order, {customerName}!</h1>

            <div className="section">
              <p>We're happy to let you know that we've received your order.</p>
              <p>
                <strong>Order Number:</strong> #{orderNumber}
              </p>
              <p>
                <strong>Order Date:</strong>{' '}
                {new Date(orderDate).toLocaleDateString()}
              </p>
            </div>

            <div className="section">
              <div className="section-title">Order Summary</div>
              <div className="order-summary">
                {items.map((item, index) => (
                  <ProductItem
                    key={index}
                    name={item.name}
                    price={item.price}
                    imageUrl={item.imageUrl}
                  />
                ))}
                <div className="total">Total: ${total.toFixed(2)}</div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">Shipping Information</div>
              <p>{shippingAddress.name}</p>
              <p>{shippingAddress.street}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.zip}
              </p>
              <p>{shippingAddress.country}</p>
            </div>

            <div className="section">
              <p>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </p>
              <Button href={trackingUrl}>Track Your Order</Button>
            </div>

            <div className="section">
              <p>
                If you have any questions about your order, please contact our
                customer service team.
              </p>
            </div>
          </div>

          <div className="footer">
            <p>
              &copy; {new Date().getFullYear()} {companyInfo.name}. All rights
              reserved.
            </p>
            <p>{companyInfo.address}</p>
            <p>
              <a
                href={companyInfo.privacyUrl}
                style={{ color: '#666', marginRight: '10px' }}
              >
                Privacy Policy
              </a>
              <a href={companyInfo.termsUrl} style={{ color: '#666' }}>
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

export const getOrderConfirmationEmailHtml = (orderData: {
  customerName: string
  orderNumber: string
  orderDate: string
  items: { name: string; price: number; imageUrl: string }[]
  total: number
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  estimatedDelivery: string
  trackingUrl: string
  companyInfo: {
    name: string
    address: string
    privacyUrl: string
    termsUrl: string
  }
}) => renderToStaticMarkup(<OrderConfirmationEmail {...orderData} />)
