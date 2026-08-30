json.analyzed_results do
  json.partial! 'row', collection: @analyzed_results, as: :analyzed_result
end