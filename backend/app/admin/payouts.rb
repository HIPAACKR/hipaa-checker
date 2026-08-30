ActiveAdmin.register_page "Payouts" do
  menu if: proc { current_user.has_role?(:super_admin) }

  content title: "Stripe Payouts" do
      payouts = Stripe::Payout.list(limit: 10) # Fetch latest 10 payouts

      table_for payouts.auto_paging_each do |payout|
        column("Payout ID") { |p| link_to p.id, "https://dashboard.stripe.com/payouts/#{p.id}", target: "_blank" }
        column("Amount ($)") { |p| (p.amount / 100.0).round(2) }
        column("Currency") { |p| p.currency.upcase }
        column("Status") { |p| status_tag p.status, class: p.status == "paid" ? "ok" : "warning" }
        column("Arrival Date") { |p| Time.at(p.arrival_date).strftime("%B %d, %Y %H:%M") }
        column("Details") { |p| link_to "View Transactions", "/admin/payouts/#{p.id}" }
      end
  end

  controller do
    def show
      payout_id = params[:id]
      payout = Stripe::Payout.retrieve(payout_id)
      transactions = Stripe::BalanceTransaction.list(payout: payout.id)

      render partial: "admin/payouts/payout_details", locals: { payout: payout, transactions: transactions }
    end
  end

end
