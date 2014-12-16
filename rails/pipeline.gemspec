# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pipeline/version'

Gem::Specification.new do |spec|
  spec.name          = "pipeline"
  spec.version       = Pipeline::VERSION
  spec.authors       = ["Richard Munroe"]
  spec.email         = ["rimunroe@gmail.com"]
  spec.summary       = "A tiny Flux framework"
  spec.description   = "Flux with strong opinions"
  spec.homepage      = "https://github.com/rimunroe/pipeline"
  spec.license       = "MIT"

  spec.files         = Dir["{lib, app}/**/*"] + ["LICENSE.txt", "README.md"]
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"

  spec.add_dependency "railties", "~> 4.0"
  spec.add_dependency "lodash-rails", "~> 2.4.1"
end
