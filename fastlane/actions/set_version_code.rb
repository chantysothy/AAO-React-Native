require "tempfile"
require "fileutils"

module Fastlane
  module Actions
    class SetVersionCodeAction < Action
      def self.run(params)
        gradle_path = params[:gradle_path]

        old_version_code = "0"
        new_version_code = params[:version_code]

        temp_file = Tempfile.new("fastlaneIncrementVersionCode")

        File.foreach(gradle_path) do |line|
          if line.include? "versionCode "
            old_version_code = line.strip.split(" ")[1]
            line = line.sub(old_version_code, new_version_code.to_s)
          end
          temp_file.puts line
        end

        temp_file.rewind
        temp_file.close
        FileUtils.mv(temp_file.path, gradle_path)
        temp_file.unlink

        if old_version_code == "0" || new_version_code == "1"
          UI.user_error!("Impossible to find the version code in the current project folder #{app_folder_name}")
        else
          UI.success("Version code has been changed from #{old_version_code} to #{new_version_code}")
        end

        new_version_code
      end

      def self.description
        "Change the version code of your android project."
      end

      def self.authors
        ["Jérémy TOUDIC", "Hawken Rives"]
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(key: :gradle_path,
                                  env_name: "INCREMENTVERSIONCODE_GRADLE_PATH",
                               description: "The path to the build.gradle file",
                                      type: String),
          FastlaneCore::ConfigItem.new(key: :version_code,
                                  env_name: "INCREMENTVERSIONCODE_VERSION_CODE",
                               description: "The version to change to",
                                      type: Integer)
        ]
      end

      def self.is_supported?(platform)
        [:android].include?(platform)
      end
    end
  end
end
