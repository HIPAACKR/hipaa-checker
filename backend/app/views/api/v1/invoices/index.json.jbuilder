# app/views/invoices/index.json.jbuilder
json.invoices @invoices do |invoice|
  json.id           invoice.id
  json.subscription invoice.subscription
  json.customer     invoice.customer
  json.amount_usd   (invoice.total.to_f / 100.0).round(2)
  json.status       invoice.status
  json.date         Time.at(invoice.created).strftime("%Y-%m-%d %H:%M:%S")
  json.pdf_url      invoice.invoice_pdf
end
