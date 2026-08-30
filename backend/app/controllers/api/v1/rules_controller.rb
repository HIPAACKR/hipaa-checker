class Api::V1::RulesController < ApiController

  def index
    yaml_files_directory = Rails.root.join('patterns', 'released', 'ios')
    json_data = []

    Dir.glob("#{yaml_files_directory}/*.yaml").each do |yaml_file|
      file_name = yaml_file.split("/").last.split(".yaml").first
      yaml_content = YAML.load_file(yaml_file)
      rule = {:"#{file_name}" => yaml_content}
      json_data.push(rule)
    end
    render json: json_data
  end

end
