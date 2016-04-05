/*
  Jasmine unit tests for BuildConfig class in types/build-config.js
 */
describe("A BuildConfig", function(){

  const BuildConfig = require('../../lib/types/build-config');

  // Each test gets a fresh BuildConfig instance, so it
  // can modify it
  beforeEach(function(){
    this.config = new BuildConfig();
  });

  afterEach(function(){
    delete this.config;
  });


  // paths

  it("has a paths property", function(){
    expect(this.config.paths).toBeDefined();
  });

  it("has a default paths.srcRoot value: 'src'", function(){
    expect(this.config.paths.srcRoot).toEqual('src');
  });

  it("has a default paths.bldRootDev value: 'dist'", function(){
    expect(this.config.paths.bldRootDev).toEqual('dist');
  });

  it("has a default paths.bldRootProd value: 'dist'", function(){
    expect(this.config.paths.bldRootProd).toEqual('dist');
  });


  // tasks

  it("has a tasks property", function(){
    expect(this.config.tasks).toBeDefined();
  });


  it("has a default tasks.defaultPrefixName value: false", function(){
    expect(this.config.tasks.defaultPrefixName).toEqual(false);
  });


  it("has a default tasks.groupBeforeAction value: true'", function(){
    expect(this.config.tasks.groupBeforeAction).toEqual(true);
  });


  // less

  it("has a less property", function(){
    expect(this.config.less).toBeDefined();
  });

  // TODO: Check less values


});