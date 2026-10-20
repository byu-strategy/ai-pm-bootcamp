--[[
learn.lua: give each `##` section that states its model a small "Learn" button beside its
heading. A section states its model in a paragraph that opens in bold with "The model:". That
line is the rule: write one and the section gets a button; the /learn skill teaches that model.

A section that practice/version-a.json cites (the public practice form parallel to the midterm)
also gets a button, so every section the midterm draws on has one, and /learn uses those
practice items in its check.

Until a section's model line is written, a `<!-- learn -->` comment inside the section gives it a
button anyway. Each marker left in the book is a section still waiting for its model line; once
the line exists, delete the marker.

The heading carries `/learn <page url>#<anchor>`. learn.js turns that into a plain-text prompt
(run the learn skill on this section, and install it from builder-template first if it is
missing), draws the button, and does
the copying; this filter only marks the heading with `data-learn`, so the table of contents and the
heading text are untouched.

The anchor is the identifier pandoc already gave the `##` heading, so it is always the real id on
the page. The page URL is the site URL plus this file's name with .html. Set `learn-base-url` in
_quarto.yml to change the site. A marker before any `##` heading is dropped with a warning.
]]

local DEFAULT_BASE = "https://byu-strategy.github.io/ai-pm-bootcamp/"

-- A model line is a paragraph that opens in bold with "The model:", either as a label
-- ("**The model:** a flow is ...") or as a whole bold sentence ("**The model: a flow is ...**").
local function is_model_line(block)
  if block.t ~= "Para" or #block.content == 0 then return false end
  local first = block.content[1]
  return first.t == "Strong" and pandoc.utils.stringify(first):match("^The model:") ~= nil
end

local function has_model_line(block)
  if is_model_line(block) then return true end
  local found = false
  if block.t == "Div" or block.t == "BlockQuote" then
    pandoc.Blocks(block.content):walk({
      Para = function(p) if is_model_line(p) then found = true end end,
    })
  end
  return found
end

local function is_marker(block)
  return block.t == "RawBlock"
    and (block.format == "html" or block.format == "markdown")
    and block.text:match("^%s*<!%-%-%s*learn%s*%-%->%s*$") ~= nil
end

-- Anchors cited by the practice form, as a set of "<chapter>.qmd#<anchor>". Read once per
-- render; a missing or unreadable file means no practice sections.
local practice_sections = nil
local function practice_cited()
  if practice_sections then return practice_sections end
  practice_sections = {}
  local f = io.open("practice/version-a.json", "r")
  if not f then return practice_sections end
  local ok, bank = pcall(pandoc.json.decode, f:read("a"), false)
  f:close()
  if not ok or type(bank) ~= "table" then
    quarto.log.warning("learn: practice/version-a.json could not be read; no practice buttons")
    return practice_sections
  end
  for _, it in ipairs(bank.items or {}) do
    for _, s in ipairs(it.sections or {}) do practice_sections[s] = true end
  end
  return practice_sections
end

local function page_name()
  local input = quarto.doc.input_file or ""
  local name = input:match("([^/\\]+)%.[^.]+$") or input
  return name .. ".html"
end

function Pandoc(doc)
  local base = DEFAULT_BASE
  if doc.meta["learn-base-url"] then
    base = pandoc.utils.stringify(doc.meta["learn-base-url"])
    if not base:match("/$") then base = base .. "/" end
  end
  local page = base .. page_name()

  -- pass 1: which ## sections state a model, are cited by the practice form, or carry a marker
  local marked, section = {}, nil
  local cited = practice_cited()
  local chapter = page_name():gsub("%.html$", ".qmd")
  for _, block in ipairs(doc.blocks) do
    if block.t == "Header" and block.level <= 2 then
      section = (block.level == 2) and block.identifier or nil
      if section and cited[chapter .. "#" .. section] then marked[section] = true end
    elseif section and section ~= "" and (has_model_line(block) or is_marker(block)) then
      marked[section] = true
    end
  end

  -- pass 2: drop the markers and tag the marked headings
  local out, found = pandoc.Blocks({}), 0
  for _, block in ipairs(doc.blocks) do
    if not is_marker(block) then
      if block.t == "Header" and block.level == 2 and marked[block.identifier] then
        block.attributes["data-learn"] = "/learn " .. page .. "#" .. block.identifier
        found = found + 1
      end
      out:insert(block)
    end
  end
  doc.blocks = out

  if found > 0 then
    quarto.doc.add_html_dependency({
      name = "learn-button",
      version = "2.0.0",
      scripts = { "learn.js" },
      stylesheets = { "learn.css" },
    })
  end
  return doc
end
