require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'json'
file = File.read('data.json')
data = JSON.parse(file)
href = 'http://www.bodypak.pl/pl/zestawy/'
out_file = File.new("new_data.json", "w")
data.each do |e|
  page = Nokogiri::HTML(open("#{href}#{e['link']}"))
  pictures = page.css("#thumbs_list_frame").children.map { |d| d.children[1]['href']}.join(' ')
  price = page.css('#our_price_display').first.text
  products = page.css('.product-pack-content').children[1].children.map { |d| d.children[1].text }.join('&')
  e['pictures'] = pictures
  e['price'] = price
  e['products'] = products
  name = page.css('.rte').css('table').css('tbody').css('tr').css('h5').children.map{ |t| t.text }
  desc = page.css('.rte').css('table').css('tbody').children.map { |d| d.children[1].children[0].children.map { |k| k.text } }
  e['name'] = name
  e['desc'] = desc
end
out_file.write(data.to_json)
out_file.close
