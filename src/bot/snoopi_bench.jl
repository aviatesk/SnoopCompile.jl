################################################################
"""
    timesum(snoop)

Calculates and prints the total time measured by a snoop macro.

It is used inside @snoopi_bench. Julia can cache inference results so to measure the effect of adding _precompile_() sentences generated by snoopi to your package, use the [`@snoopi_bench`](@ref). This benchmark measures inference time taken during loading and running of a package.

# Examples
```julia
using SnoopCompile
data = @snoopi begin
    include(joinpath(dirname(dirname(pathof(MatLang))),"test","runtests.jl"))
end;
println(timesum(data));
```

## Manual Benchmark (withtout using [`@snoopi_bench`](@ref))
- dev your package

- comment the precompile part of your package (`include()` and `_precompile_()`)
- run the following benchmark
- restart Julia

- uncomment the precompile part of your package (`include()` and `_precompile_()`)
- run the following benchmark
- restart Julia

### Benchmark
```julia
using SnoopCompile

println("Package load time:")
loadSnoop = @snoopi using MatLang

timesum(loadSnoop)

println("Running Examples/Tests:")
runSnoop = @snoopi begin
    using MatLang
    include(joinpath(dirname(dirname(pathof(MatLang))),"test","runtests.jl"))
end

timesum(runSnoop)
```
"""
function timesum(snoop::Vector{Tuple{Float64, Core.MethodInstance}})
    if isempty(snoop)
        return 0.0
    else
        return sum(first, snoop)
    end
end

################################################################
"""
    @snoopi_bench(packageName::String, snoopScript::Expr)
    @snoopi_bench(packageName::String)

Performs an infertime benchmark by activating and deactivating the _precompile_()
# Examples
Benchmarking the load infer time
```julia
println("loading infer benchmark")

@snoopi_bench "MatLang" using MatLang
```

Benchmarking the example infer time
```julia
println("examples infer benchmark")

@snoopi_bench "MatLang" begin
    using MatLang
    examplePath = joinpath(dirname(dirname(pathof(MatLang))), "examples")
    # include(joinpath(examplePath,"Language_Fundamentals", "usage_Entering_Commands.jl"))
    include(joinpath(examplePath,"Language_Fundamentals", "usage_Matrices_and_Arrays.jl"))
    include(joinpath(examplePath,"Language_Fundamentals", "Data_Types", "usage_Numeric_Types.jl"))
end
```
"""
macro snoopi_bench(packageName::String, snoopScript::Expr)

    ################################################################
    packagePath = joinpath(pwd(),"src","$packageName.jl")
    precompilePath, precompileFolder = precompile_pather(packageName)

    juliaCode = """
    using SnoopCompile; data = @snoopi begin
        $(string(snoopScript));
    end;
    println(timesum(data));
    """
    juliaCmd = `julia --project=@. -e "$juliaCode"`
    quote
        packageSym = Symbol($packageName)
        ################################################################
        using SnoopCompile
        println("""*******************
        Benchmark Started
        *******************
        """)
        ################################################################
        println("""Precompile Deactivated Benchmark
        ------------------------
        """)
        precompile_deactivator($packagePath, $precompilePath);
        ### Log the compiles
        run($juliaCmd)
        ################################################################
        println("""Precompile Activated Benchmark
        ------------------------
        """)
        precompile_activator($packagePath, $precompilePath)
        ### Log the compiles
        run($juliaCmd)
        println("""*******************
        Benchmark Finished
        *******************
        """)
    end

end

"""
    @snoopi_bench packageName::String

Benchmarking the infer time of the tests:
```julia
@snoopi_bench "MatLang"
```
"""
macro snoopi_bench(packageName::String)
    package = Symbol(packageName)
    snoopScript = :(
        using $(package);
        runtestpath = joinpath(dirname(dirname(pathof($(package)))), "test", "runtests.jl");
        include(runtestpath);
    )
    return quote
        @snoopi_bench $packageName $(snoopScript)
    end
end
