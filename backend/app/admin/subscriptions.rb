ActiveAdmin.register_page "Subscriptions" do
  menu if: proc { current_user.has_role?(:super_admin) }

  content title: "Subscriptions" do
    panel "Latest Paid Subscriptions" do
      table_for fetch_latest_invoices do
        column("Subscription ID") { |invoice| invoice.subscription }
        column("Customer ID") { |invoice| invoice.customer }
        column("User") { |invoice| Stripe::Customer.retrieve(invoice.customer)&.email rescue nil }
        column("Amount ($)") { |invoice|
          link_to "#{invoice.total.to_f / 100}", invoice.invoice_pdf, target: "_blank", rel: "noopener" , type: "application/pdf"
        }
        column("Type") do |invoice|
          invoice.total.to_f.positive? ? "Charge" : "Refund/Credit"
        end
        column("Status") { |invoice| invoice.status }
        column("Date") { |invoice| Time.at(invoice.created).strftime("%Y-%m-%d %H:%M:%S") }
      end
    end
  end

  controller do
    def fetch_latest_invoices
      @latest_invoices ||= Stripe::Invoice.list(
        status: 'paid',
        limit: 10000
      ).data.reject { |invoice| invoice.total.to_f == 0 }
    end

    def calculate_total_income(invoices)
      invoices.sum { |invoice| invoice.total.to_f / 100 }
    end

    helper_method :fetch_latest_invoices, :calculate_total_income
  end
end
