var documenterSearchIndex = {"docs":
[{"location":"userimg/#userimg-1","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"","category":"section"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"If you want to save more precompile information, one option is to create a \"userimg.jl\" file with with to build Julia. This is only supported for @snoopc. Instead of calling SnoopCompile.parcel and SnoopCompile.write, use the following:","category":"page"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"# Use these two lines if you want to add to your userimg.jl\npc = SnoopCompile.format_userimg(reverse!(data[2]))\nSnoopCompile.write(\"/tmp/userimg_Images.jl\", pc)","category":"page"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"Now move the resulting file to your Julia source directory, and create a userimg.jl file that includes all the package-specific precompile files you want. Then build Julia from source. You should note that your latencies decrease substantially.","category":"page"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"There are serious negatives associated with a userimg.jl script:","category":"page"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"Your julia build times become very long\nPkg.update() will have no effect on packages that you've built into julia until you next recompile julia itself. Consequently, you may not get the benefit of enhancements or bug fixes.\nFor a package that you sometimes develop, this strategy is very inefficient, because testing a change means rebuilding Julia as well as your package.","category":"page"},{"location":"userimg/#","page":"Creating userimg.jl files","title":"Creating userimg.jl files","text":"A process similar to this one is also performed via PackageCompiler.","category":"page"},{"location":"snoopc/#Snooping-on-code-generation:-@snoopc-1","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"","category":"section"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"@snoopc has the advantage of working on any modern version of Julia. It \"snoops\" on the code-generation phase of compilation (the 'c' is a reference to code-generation). Note that while native code is not cached, it nevertheless reveals which methods are being compiled.","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"Note that unlike @snoopi, @snoopc will generate all methods, not just the top-level methods that trigger compilation. (It is redundant to precompile dependent methods, but neither is it harmful.) It is also worth noting that @snoopc requires \"spinning up\" a new Julia process, and so it is a bit slower than @snoopi.","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"Let's demonstrate @snoopc with a snoop script, in this case for the ColorTypes package:","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"using SnoopCompile\n\n### Log the compiles\n# This only needs to be run once (to generate \"/tmp/colortypes_compiles.log\")\n\nSnoopCompile.@snoopc \"/tmp/colortypes_compiles.log\" begin\n    using ColorTypes, Pkg\n    include(joinpath(dirname(dirname(pathof(ColorTypes))), \"test\", \"runtests.jl\"))\nend\n\n### Parse the compiles and generate precompilation scripts\n# This can be run repeatedly to tweak the scripts\n\ndata = SnoopCompile.read(\"/tmp/colortypes_compiles.log\")\n\npc = SnoopCompile.parcel(reverse!(data[2]))\nSnoopCompile.write(\"/tmp/precompile\", pc)","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"As with @snoopi, the \"/tmp/precompile\" folder will now contain a number of *.jl files, organized by package. For each package, you could copy its corresponding *.jl file into the package's src/ directory and include it into the package as described for @snoopi.","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"There are more complete example illustrating potential options in the examples/ directory.","category":"page"},{"location":"snoopc/#Additional-flags-1","page":"Snooping on code generation: @snoopc","title":"Additional flags","text":"","category":"section"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"When calling the @snoopc macro, a new julia process is spawned using the function Base.julia_cmd(). Advanced users may want to tweak the flags passed to this process to suit specific needs. This can be done by passing an array of flags of the form [\"--flag1\", \"--flag2\"] as the first argument to the @snoop macro. For instance, if you want to pass the --project=/path/to/dir flag to the process, to cause the julia process to load the project specified by the path, a snoop script may look like:","category":"page"},{"location":"snoopc/#","page":"Snooping on code generation: @snoopc","title":"Snooping on code generation: @snoopc","text":"using SnoopCompile\n\nSnoopCompile.@snoopc [\"--project=/path/to/dir\"] \"/tmp/compiles.csv\" begin\n    # ... statement to snoop on\nend\n\n# ... processing the precompile statements","category":"page"},{"location":"reference/#Reference-1","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"@snoopi\n@snoopc\nSnoopCompile.parcel\nSnoopCompile.write\nSnoopCompile.read\nSnoopCompile.format_userimg","category":"page"},{"location":"reference/#SnoopCompile.@snoopi","page":"Reference","title":"SnoopCompile.@snoopi","text":"inf_timing = @snoopi commands\ninf_timing = @snoopi tmin=0.0 commands\n\nExecute commands while snooping on inference. Returns an array of (t, linfo) tuples, where t is the amount of time spent infering linfo (a MethodInstance).\n\nMethods that take less time than tmin will not be reported.\n\n\n\n\n\n","category":"macro"},{"location":"reference/#SnoopCompile.@snoopc","page":"Reference","title":"SnoopCompile.@snoopc","text":"@snoopc \"compiledata.csv\" begin\n    # Commands to execute, in a new process\nend\n\ncauses the julia compiler to log all functions compiled in the course of executing the commands to the file \"compiledata.csv\". This file can be used for the input to SnoopCompile.read.\n\n\n\n\n\n","category":"macro"},{"location":"reference/#SnoopCompile.parcel","page":"Reference","title":"SnoopCompile.parcel","text":"pc = parcel(calls; subst=[], blacklist=[]) assigns each compile statement to the module that owns the function. Perform string substitution via subst=[\"Module1\"=>\"Module2\"], and omit functions in particular modules with blacklist=[\"Module3\"]. On output, pc[:Module2] contains all the precompiles assigned to Module2.\n\nUse SnoopCompile.write(prefix, pc) to generate a series of files in directory prefix, one file per module.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SnoopCompile.write","page":"Reference","title":"SnoopCompile.write","text":"write(prefix::AbstractString, pc::Dict; always::Bool = false)\n\nWrite each modules' precompiles to a separate file.  If always is true, the generated function will always run the precompile statements when called, otherwise the statements will only be called during package precompilation.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SnoopCompile.read","page":"Reference","title":"SnoopCompile.read","text":"SnoopCompile.read(\"compiledata.csv\") reads the log file produced by the compiler and returns the functions as a pair of arrays. The first array is the amount of time required to compile each function, the second is the corresponding function + types. The functions are sorted in order of increasing compilation time. (The time does not include the cost of nested compiles.)\n\n\n\n\n\n","category":"function"},{"location":"reference/#SnoopCompile.format_userimg","page":"Reference","title":"SnoopCompile.format_userimg","text":"pc = format_userimg(calls; subst=[], blacklist=[]) generates precompile directives intended for your base/userimg.jl script. Use SnoopCompile.write(filename, pc) to create a file that you can include into userimg.jl.\n\n\n\n\n\n","category":"function"},{"location":"#SnoopCompile.jl-1","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"","category":"section"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"SnoopCompile \"snoops\" on the Julia compiler, causing it to record the functions and argument types it's compiling.  From these lists of methods, you can generate lists of precompile directives that may reduce the latency between loading packages and using them to do \"real work.\"","category":"page"},{"location":"#Background-1","page":"SnoopCompile.jl","title":"Background","text":"","category":"section"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"Julia uses Just-in-time (JIT) compilation to generate the code that runs on your CPU. Broadly speaking, there are two major steps: inference and code generation. Inference is the process of determining the type of each object, which in turn determines which specific methods get called; once type inference is complete, code generation performs optimizations and ultimately generates the assembly language (native code) used on CPUs. Some aspects of this process are documented here.","category":"page"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"Every time you load a package in a fresh Julia session, the methods you use need to be JIT-compiled, and this contributes to the latency of using the package. In some circumstances, you can save some of the work to reduce the burden next time. This is called precompilation. Unfortunately, precompilation is not as comprehensive as one might hope. Currently, Julia is only capable of saving inference results (not native code) in the *.ji files that are the result of precompilation. Moreover, there are some significant constraints that sometimes prevent Julia from saving even the inference results; and finally, what does get saved can sometimes be invalidated if later packages provide more specific methods that supersede some of the calls in the precompiled methods.","category":"page"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"Despite these limitations, there are cases where precompilation can substantially reduce latency. SnoopCompile is designed to try to make it easy to try precompilation to see whether it produces measurable benefits.","category":"page"},{"location":"#Who-should-use-this-package-1","page":"SnoopCompile.jl","title":"Who should use this package","text":"","category":"section"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"SnoopCompile is intended primarily for package developers who want to improve the experience for their users. Because the results of SnoopCompile are typically stored in the *.ji precompile files, anyone can take advantage of the reduced latency.","category":"page"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"PackageCompiler is an alternative that non-developer users may want to consider for their own workflow. It performs more thorough precompilation than the \"standard\" usage of SnoopCompile, although one can achieve a similar effect by creating userimg.jl files. However, the cost is vastly increased build times, which for package developers is unlikely to be productive.","category":"page"},{"location":"#","page":"SnoopCompile.jl","title":"SnoopCompile.jl","text":"Finally, another alternative that reduces latency without any modifications to package files is Revise. It can be used in conjunction with SnoopCompile.","category":"page"},{"location":"snoopi/#Snooping-on-inference:-@snoopi-1","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"","category":"section"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"The most useful tool is a macro, @snoopi, which is only available on Julia 1.2 or higher. Here's a quick demo:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"using SnoopCompile\n\na = rand(Float16, 5)\n\njulia> inf_timing = @snoopi sum(a)\n1-element Array{Tuple{Float64,Core.MethodInstance},1}:\n (0.011293888092041016, MethodInstance for sum(::Array{Float16,1}))","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"We defined the argument a, and then called sum(a) while \"snooping\" on inference. (The i in @snoopi means \"inference.\") The return is a list of \"top level\" methods that got compiled, together with the amount of time spent on inference. In this case it was just a single method, which required approximately 11ms of inference time. (Inferring sum required inferring all the methods that it calls, but these are subsumed into the top level inference of sum itself.) Note that the method that got called,","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"julia> @which sum(a)\nsum(a::AbstractArray) in Base at reducedim.jl:652","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"is much more general (i.e., defined for AbstractArray) than the MethodInstance (defined for Array{Float16,1}). This is because precompilation happens only for concrete objects passed as arguments.","category":"page"},{"location":"snoopi/#Precompile-scripts-1","page":"Snooping on inference: @snoopi","title":"Precompile scripts","text":"","category":"section"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"You can use @snoopi to come up with a list of precompile-worthy functions. A recommended approach is to write a script that \"exercises\" the functionality you'd like to precompile. One option is to use your package's \"runtests.jl\" file, or you can write a custom script for this purpose. Here's an example for the FixedPointNumbers package:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"using FixedPointNumbers\n\nx = N0f8(0.2)\ny = x + x\ny = x - x\ny = x*x\ny = x/x\ny = Float32(x)\ny = Float64(x)\ny = 0.3*x\ny = x*0.3\ny = 2*x\ny = x*2\ny = x/15\ny = x/8.0","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"Save this as a file \"snoopfpn.jl\" and navigate at the Julia REPL to that directory, and then do","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"julia> using SnoopCompile\n\njulia> inf_timing = @snoopi tmin=0.01 include(\"snoopfpn.jl\")\n2-element Array{Tuple{Float64,Core.MethodInstance},1}:\n (0.03108978271484375, MethodInstance for *(::Normed{UInt8,8}, ::Normed{UInt8,8}))\n (0.04189491271972656, MethodInstance for Normed{UInt8,8}(::Float64))             ","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"Here, note the tmin=0.01, which causes any methods that take less than 10ms of inference time to be discarded.","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"note: Note\nIf you're testing this, you might get different results depending on the speed of your machine. Moreover, if FixedPointNumbers has already precompiled these method and type combinations–-perhaps by incorporating a precompile file produced by SnoopCompile–-then those methods will be absent. If you want to try this example, dev FixedPointNumbers and disable any _precompile_() call you find.","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"You can inspect these results and write your own precompile file, or use the automated tools provided by SnoopCompile.","category":"page"},{"location":"snoopi/#auto-1","page":"Snooping on inference: @snoopi","title":"Producing precompile directives automatically","text":"","category":"section"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"You can take the output of @snoopi and \"parcel\" it into packages:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"julia> pc = SnoopCompile.parcel(inf_timing)\nDict{Symbol,Array{String,1}} with 1 entry:\n  :FixedPointNumbers => [\"precompile(Tuple{typeof(*),Normed{UInt8,8},Normed{UInt8,8}})\", \"precompile(Tuple{Type{Normed{UInt8,8}},Float64})\"]","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"This splits the calls up into a dictionary, pc, indexed by the package which \"owns\" each call. (In this case there is only one, FixedPointNumbers, but in more complex cases there may be several.) You can then write the results to files:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"julia> SnoopCompile.write(\"/tmp/precompile\", pc)","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"If you look in the /tmp/precompile directory, you'll see one or more files, named by their parent package, that may be suitable for includeing into the package. In this case:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"/tmp/precompile$ cat precompile_FixedPointNumbers.jl\nfunction _precompile_()\n    ccall(:jl_generating_output, Cint, ()) == 1 || return nothing\n    precompile(Tuple{typeof(*),Normed{UInt8,8},Normed{UInt8,8}})\n    precompile(Tuple{Type{Normed{UInt8,8}},Float64})\nend","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"If you copy this file to a precompile.jl file in the src directory, you can incorporate it into the package like this:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"module FixedPointNumbers\n\n# All the usual commands that define the module go here\n\n# ... followed by:\n\ninclude(\"precompile.jl\")\n_precompile_()\n\nend # module FixedPointNumbers","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"The listed method/type combinations should have their inference results cached. Load the package once to precompile it, and then in a fresh Julia session try this:","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"julia> using SnoopCompile\n\njulia> inf_timing = @snoopi tmin=0.01 include(\"snoopfpn.jl\")\n0-element Array{Tuple{Float64,Core.MethodInstance},1}","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"The fact that no methods were returned is a sign of success: Julia didn't need to call inference on those methods, because it used the inference results from the cache file.","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"note: Note\nSometimes, @snoopi will show method & type combinations that you precompiled. This is a sign that despite your attempts, Julia declined to cache the inference results for those methods. You can either delete those directives from the precompile file, or hope that they will become useful in a future version of Julia. Note that having many \"useless\" precompile directives can slow down precompilation.","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"note: Note\nAs you develop your package, it's possible you'll modify or delete some of the methods that appear in your \"precompile.jl\" file. This will not result in an error; by default precompile fails silently. If you want to be certain that your precompile directives don't go stale, preface each with an @assert. Note that this forces you to update your precompile directives as you modify your package, which may or may not be desirable.","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"The statements appear in the precompile file in order of inference time, with the first methods taking the longest to precompile. If you find that some precompile directives are ineffective (they appear in a new @snoopi despite being precompiled) and their inference time is substantial, sometimes a bit of manual investigation of the callees can lead to insights. For example, you might be able to introduce a precompile in a dependent package) that can mitigate the total time.","category":"page"},{"location":"snoopi/#Producing-precompile-directives-manually-1","page":"Snooping on inference: @snoopi","title":"Producing precompile directives manually","text":"","category":"section"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"While this \"automated\" approach is often useful, sometimes it makes more sense to inspect the results and write your own precompile directives. For example, for FixedPointNumbers a more elegant and comprehensive precompile file might be","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"function _precompile_()\n    ccall(:jl_generating_output, Cint, ()) == 1 || return nothing\n    for T in (N0f8, N0f16)      # Normed types we want to support\n        for f in (+, -, *, /)   # operations we want to support\n            precompile(Tuple{typeof(f),T,T})\n            for S in (Float32, Float64, Int)   # other number types we want to support\n                precompile(Tuple{typeof(f),T,S})\n                precompile(Tuple{typeof(f),S,T})\n            end\n        end\n        for S in (Float32, Float64)\n            precompile(Tuple{Type{T},S})\n            precompile(Tuple{Type{S},T})\n        end\n    end\nend","category":"page"},{"location":"snoopi/#","page":"Snooping on inference: @snoopi","title":"Snooping on inference: @snoopi","text":"This covers +, -, *, /, and conversion for various combinations of types. The results from @snoopi can suggest method/type combinations that might be useful to precompile, but often you can generalize its suggestions in useful ways.","category":"page"}]
}